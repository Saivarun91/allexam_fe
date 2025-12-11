// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "@/hooks/use-toast";

// export default function AdminFeaturesPage() {
//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
//   const API_URL = `${API_BASE}/api/home/admin/features/`;

//   const [features, setFeatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingSlug, setEditingSlug] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     icon: "",
//     gradient: "",
//     slug: "",
//     meta_title: "",
//     meta_keywords: "",
//     meta_description: "",
//     order: 0,
//     is_active: true,
//   });

//   const iconOptions = [
//     "Star", "Brain", "BarChart3", "BookOpen", "Rocket", "Lightbulb",
//     "Target", "ShieldCheck", "Trophy", "Clock", "ChartLine",
//     "TrendingUp", "Award", "Globe", "Zap"
//   ];

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
//     return {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   };

//   const fetchFeatures = async () => {
//     try {
//       const res = await axios.get(API_URL, { headers: getAuthHeaders() });
//       if (res.data.success && res.data.features) {
//         setFeatures(res.data.features);
//       } else {
//         toast({
//           title: "Error",
//           description: "Unable to load features.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching features:", error);
//       toast({
//         title: "Error",
//         description: "Unable to load features.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFeatures();
//   }, []);

//   const generateSlug = (title) => {
//     return title
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/[-\s]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const newFormData = { ...formData, [name]: value };
    
//     // Auto-generate slug from title if slug is empty and title is being changed
//     if (name === 'title' && !formData.slug && !editingSlug) {
//       newFormData.slug = generateSlug(value);
//     }
    
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title.trim() || !formData.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Title and description are required.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       if (editingSlug) {
//         const res = await axios.put(`${API_URL}${editingSlug}/`, formData, {
//           headers: getAuthHeaders(),
//         });
//         if (res.data.success) {
//           toast({ title: "Updated", description: "Feature updated successfully." });
//           setEditingSlug(null);
//         } else {
//           toast({ title: "Error", description: res.data.error || "Update failed", variant: "destructive" });
//         }
//       } else {
//         const res = await axios.post(API_URL, formData, {
//           headers: getAuthHeaders(),
//         });
//         if (res.data.success) {
//           toast({ title: "Created", description: "Feature added successfully." });
//         } else {
//           toast({ title: "Error", description: res.data.error || "Create failed", variant: "destructive" });
//         }
//       }

//       setFormData({ 
//         title: "", 
//         description: "", 
//         icon: "", 
//         gradient: "", 
//         slug: "", 
//         meta_title: "", 
//         meta_keywords: "", 
//         meta_description: "",
//         order: 0,
//         is_active: true,
//       });
//       fetchFeatures();
//     } catch (error) {
//       console.error("Error saving feature:", error);
//       const errorMsg = error.response?.data?.error || error.message || "Something went wrong while saving.";
//       toast({ title: "Error", description: errorMsg, variant: "destructive" });
//     }
//   };

//   const handleEdit = (feature) => {
//     setEditingSlug(feature.slug);
//     setFormData({
//       title: feature.title || "",
//       description: feature.description || "",
//       icon: feature.icon || "",
//       gradient: feature.gradient || "",
//       slug: feature.slug || "",
//       meta_title: feature.meta_title || "",
//       meta_keywords: feature.meta_keywords || "",
//       meta_description: feature.meta_description || "",
//       order: feature.order || 0,
//       is_active: feature.is_active !== undefined ? feature.is_active : true,
//     });
//   };

//   const handleDelete = async (slug) => {
//     if (!confirm("Are you sure you want to delete this feature?")) return;

//     try {
//       const res = await axios.delete(`${API_URL}${slug}/`, {
//         headers: getAuthHeaders(),
//       });
//       if (res.data && res.data.success) {
//         toast({ title: "Deleted", description: "Feature deleted successfully." });
//         fetchFeatures();
//       } else {
//         toast({ title: "Error", description: res.data?.error || "Failed to delete feature.", variant: "destructive" });
//       }
//     } catch (error) {
//       console.error("Error deleting feature:", error);
//       const errorMsg = error.response?.data?.error || error.message || "Failed to delete feature.";
//       toast({ title: "Error deleting feature", description: errorMsg, variant: "destructive" });
//     }
//   };

//   return (
//     <section className="py-16 container mx-auto px-4">
//       <motion.div
//         className="text-center mb-10"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
//           Feature Management
//         </h2>
//         <p className="text-muted-foreground text-lg">
//           Add, edit, or delete homepage feature cards dynamically.
//         </p>
//       </motion.div>

//       <Card className="max-w-3xl mx-auto mb-10 shadow-md border border-primary/10">
//         <CardHeader>
//           <CardTitle>{editingSlug ? "Edit Feature" : "Create New Feature"}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="text-sm font-medium mb-1 block">Title *</label>
//               <Input
//                 name="title"
//                 placeholder="Enter feature title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-1 block">Description *</label>
//               <Textarea
//                 name="description"
//                 placeholder="Enter feature description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-1 block">Slug (SEO-friendly URL) *</label>
//               <Input
//                 name="slug"
//                 placeholder="e.g., advanced-analytics-feature"
//                 value={formData.slug}
//                 onChange={handleChange}
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">Auto-generated from title if left empty</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-1 block">Icon *</label>
//               <select
//                 name="icon"
//                 value={formData.icon}
//                 onChange={handleChange}
//                 className="w-full border rounded-md p-2 text-gray-700 focus:ring focus:ring-primary/30"
//                 required
//               >
//                 <option value="">Select an icon</option>
//                 {iconOptions.map((icon) => (
//                   <option key={icon} value={icon}>{icon}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-1 block">Gradient</label>
//               <Input
//                 name="gradient"
//                 placeholder="e.g., from-blue-500 to-indigo-500"
//                 value={formData.gradient}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-1 block">Order</label>
//               <Input
//                 name="order"
//                 type="number"
//                 placeholder="Display order (0, 1, 2...)"
//                 value={formData.order}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name="is_active"
//                 checked={formData.is_active}
//                 onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
//                 className="w-4 h-4"
//               />
//               <label className="text-sm font-medium">Active (Show on home page)</label>
//             </div>
            
//             <div className="border-t pt-4 mt-4">
//               <h3 className="text-lg font-semibold mb-3">SEO Settings</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Meta Title</label>
//                   <Input
//                     name="meta_title"
//                     placeholder="SEO meta title"
//                     value={formData.meta_title}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Meta Keywords</label>
//                   <Input
//                     name="meta_keywords"
//                     placeholder="keyword1, keyword2, keyword3"
//                     value={formData.meta_keywords}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Meta Description</label>
//                   <Textarea
//                     name="meta_description"
//                     placeholder="SEO meta description"
//                     value={formData.meta_description}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3">
//               {editingSlug && (
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   onClick={() => {
//                     setEditingSlug(null);
//                     setFormData({ 
//                       title: "", 
//                       description: "", 
//                       icon: "", 
//                       gradient: "", 
//                       slug: "", 
//                       meta_title: "", 
//                       meta_keywords: "", 
//                       meta_description: "",
//                       order: 0,
//                       is_active: true,
//                     });
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               )}
//               <Button type="submit">{editingSlug ? "Update Feature" : "Create Feature"}</Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 max-w-5xl mx-auto">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading features...</p>
//         ) : features.length > 0 ? (
//           features.map((feature) => (
//             <Card key={feature.id} className="border border-primary/10 hover:shadow-md transition-all">
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-primary mb-1">{feature.title}</h3>
//                     <p className="text-muted-foreground mb-2">{feature.description}</p>
//                     <div className="space-y-1 text-sm text-gray-500">
//                       <p><strong>Slug:</strong> {feature.slug || "—"}</p>
//                       <p><strong>Icon:</strong> {feature.icon || "—"}</p>
//                       <p><strong>Gradient:</strong> {feature.gradient || "—"}</p>
//                       <p><strong>Order:</strong> {feature.order || 0}</p>
//                       <p><strong>Status:</strong> {feature.is_active ? "Active" : "Inactive"}</p>
//                       {(feature.meta_title || feature.meta_keywords || feature.meta_description) && (
//                         <div className="mt-2 pt-2 border-t">
//                           <p className="font-semibold text-xs text-gray-600 mb-1">SEO:</p>
//                           {feature.meta_title && <p><strong>Title:</strong> {feature.meta_title}</p>}
//                           {feature.meta_keywords && <p><strong>Keywords:</strong> {feature.meta_keywords}</p>}
//                           {feature.meta_description && <p><strong>Description:</strong> {feature.meta_description.substring(0, 100)}...</p>}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3">
//                   <Button variant="outline" onClick={() => handleEdit(feature)}>Edit</Button>
//                   <Button variant="destructive" onClick={() => handleDelete(feature.slug)}>Delete</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <p className="text-center text-muted-foreground">
//             No features found. Add one using the form above.
//           </p>
//         )}
//       </div>
//     </section>
//   );
// }
