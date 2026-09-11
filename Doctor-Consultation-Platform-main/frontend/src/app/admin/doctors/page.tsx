"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getWithAuth, putWithAuth } from "@/service/httpService";
import {
  Calendar,
  Mail,
  Search,
  UserCheck,
  UserX,
  Stethoscope,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  licenseNumber?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
  isActive?: boolean;
  createdAt?: string;
}

const Page = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await getWithAuth("/admin/doctors");
      setDoctors(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await putWithAuth(`/admin/doctors/${id}/approve`, {});
      toast.success("Doctor approved successfully");
      await fetchDoctors();
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await putWithAuth(`/admin/doctors/${id}/reject`, {});
      toast.success("Doctor rejected successfully");
      await fetchDoctors();
    } catch (error) {
      console.error("Reject failed:", error);
      toast.error("Reject failed");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredDoctors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return doctors;

    return doctors.filter((doc) => {
      const name = doc.name?.toLowerCase() || "";
      const email = doc.email?.toLowerCase() || "";
      const license = doc.licenseNumber?.toLowerCase() || "";

      return (
        name.includes(term) ||
        email.includes(term) ||
        license.includes(term)
      );
    });
  }, [doctors, searchTerm]);

  const formatJoinedDate = (createdAt?: string) => {
    if (!createdAt) return "N/A";

    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString();
  };

  const getStatusBadge = (status?: string) => {
    if (status === "verified") {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <UserCheck className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }

    if (status === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <UserX className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Pending
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Doctors</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email or license..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doctors ({filteredDoctors.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">License</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doc) => (
                  <tr key={doc._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {doc.email}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium">
                      {doc.licenseNumber || "N/A"}
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(doc.verificationStatus)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatJoinedDate(doc.createdAt)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {doc.verificationStatus === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleApprove(doc._id)}
                            disabled={processingId === doc._id}
                          >
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(doc._id)}
                            disabled={processingId === doc._id}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : doc.verificationStatus === "verified" ? (
                        <span className="text-green-600 font-medium">
                          Approved
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No doctors found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;