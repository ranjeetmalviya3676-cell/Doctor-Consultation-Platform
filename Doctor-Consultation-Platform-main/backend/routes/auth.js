const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const Doctor = require('../modal/Doctor')
const Patient = require('../modal/Patient')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();


const signToken = (id, type) =>
    jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '7d' });


router.post('/doctor/register',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        body('licenseNumber').notEmpty().withMessage("License number is required")
    ],
    validate,
    async (req, res) => {
        try {
            let { email, password, licenseNumber } = req.body;

            // ✅ normalize license (important)
            licenseNumber = licenseNumber.trim().toUpperCase();

            // ✅ email check
            const exists = await Doctor.findOne({ email });
            if (exists) return res.badRequest("Doctor already exists");

            // ✅ license format check (strong validation)
            if (!licenseNumber.match(/^[A-Z]{2,5}[0-9]{3,}$/)) {
                return res.badRequest("Invalid license format (e.g. GMC12345)");
            }

            // ✅ license duplicate check
            const licenseExists = await Doctor.findOne({ licenseNumber });
            if (licenseExists) {
                return res.badRequest("License already registered");
            }

            const hashed = await bcrypt.hash(password, 12);

            // ✅ DEMO verification logic
            let verificationStatus = "pending";

            if (
                licenseNumber.startsWith("GMC") ||
                licenseNumber.startsWith("MMC")
            ) {
                verificationStatus = "verified"; // demo auto verify
            }

            const doc = await Doctor.create({
                ...req.body,
                licenseNumber, // ✅ save normalized
                password: hashed,
                verificationStatus,
                isVerified: verificationStatus === "verified"
            });

            const token = signToken(doc._id, 'doctor');

            res.created(
                { token, user: { id: doc._id, type: 'doctor' } },
                'Doctor registered'
            );

        } catch (error) {
            res.serverError('Registration failed', [error.message])
        }
    }
)


router.post('/doctor/login',
    [
        body('email').notEmpty().withMessage('Email or license number is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validate,
    async (req, res) => {
        try {
            const { email, password } = req.body;

            const doc = await Doctor.findOne({
                $or: [
                    { email: email },
                    { licenseNumber: String(email).toUpperCase().trim() }
                ]
            });

            if (!doc || !doc.password) {
                return res.unauthorized('Invalid credentials');
            }

            const match = await bcrypt.compare(password, doc.password);
            if (!match) {
                return res.unauthorized('Invalid credentials');
            }

            if (doc.verificationStatus === 'pending') {
                return res.badRequest('Doctor not verified yet. Your account is pending admin approval.');
            }

            if (doc.verificationStatus === 'rejected') {
                return res.badRequest('Doctor rejected by admin. Please contact support or register again with valid details.');
            }

            if (doc.verificationStatus !== 'verified') {
                return res.badRequest('Doctor verification incomplete.');
            }

            const token = signToken(doc._id, 'doctor');

            res.created(
                { token, user: { id: doc._id, type: 'doctor' } },
                'Login successful'
            );
        } catch (error) {
            res.serverError('Login failed', [error.message]);
        }
    }
);


router.post('/patient/register',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
    ],
    validate,
    async (req, res) => {
        try {
            const exists = await Patient.findOne({ email: req.body.email });
            if (exists) return res.badRequest("Patient alredy exists");
            const hashed = await bcrypt.hash(req.body.password, 12);
            const patient = await Patient.create({ ...req.body, password: hashed });
            const token = signToken(patient._id, 'patient');
            res.created({ token, user: { id: patient._id, type: 'patient' } }, 'Patient registered')
        } catch (error) {
            res.serverError('Registration failed', [error.message])
        }
    }
)


router.post('/patient/login',
    [
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
    ],
    validate,
    async (req, res) => {
        try {
            const patient = await Patient.findOne({ email: req.body.email });
            if (!patient || !patient.password) return res.unauthorized("Invalid credentials");
            const match = await bcrypt.compare(req.body.password, patient.password);
            if (!match) return res.unauthorized("Invalid credentials");
            const token = signToken(patient._id, 'patient');
            res.created({ token, user: { id: patient._id, type: 'patient' } }, 'Login successful')
        } catch (error) {
            res.serverError('Login failed', [error.message])
        }
    }
)



//Google Outh Start form here


router.get('/google', (req, res, next) => {
    const userType = req.query.type || 'patient';

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: userType,
        prompt: 'select_account'
    })(req, res, next)
})



router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: "/auth/failure"
    }),

    async (req, res) => {
        try {
            const { user, type } = req.user;
            const token = signToken(user._id, type);


            //Redirect to frontend with token
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const redirectUrl = `${frontendUrl}/auth/success?token=${token}&type=${type}&user=${encodeURIComponent(JSON.stringify({
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            }))}`;

            res.redirect(redirectUrl)
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(e.message)}`)
        }
    }
)


//Auth failure
router.get('/failure', (req, res) => res.badRequest('Google authentication Failed'))


module.exports = router;