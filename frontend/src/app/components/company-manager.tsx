import { useState, useEffect } from "react";
import apiClient from "../../api/client";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function CompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  const fetchCompanies = async () => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get("/companies/", { headers: { Authorization: `Bearer ${token}` } });
    setCompanies(response.data.results);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    await apiClient.post("/companies/", { name, description, website }, { headers: { Authorization: `Bearer ${token}` } });
    fetchCompanies();
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    await apiClient.put(`/companies/${selectedCompany.id}/`, { name, description, website }, { headers: { Authorization: `Bearer ${token}` } });
    fetchCompanies();
    setSelectedCompany(null);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    await apiClient.delete(`/companies/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
    fetchCompanies();
  };

  const openEditDialog = (company: any) => {
    setSelectedCompany(company);
    setName(company.name);
    setDescription(company.description);
    setWebsite(company.website);
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Manage Companies</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Company</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Company</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCreate}>Save</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>{company.website}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditDialog(company)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(company.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
