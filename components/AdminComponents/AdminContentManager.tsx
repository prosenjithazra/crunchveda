"use client";

import type { AdminContentRecord, AdminModule, AdminSectionField, AdminStatus } from "@/json/mock/admin";
import { adminContentService } from "@/services/admin/contentService";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography, Paper, Divider } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminPageHeader from "./AdminPageHeader";
import ConfirmDialog from "./ConfirmDialog";
import { SectionFieldEditor } from "./AdminFormFields";

type AdminContentManagerProps = {
  moduleId: string;
};

const blankSection = (): AdminContentRecord => ({
  id: `section-${Date.now()}`,
  title: "New Section",
  type: "Section",
  status: "Draft",
  updatedAt: new Date().toISOString().slice(0, 10),
  fields: [
    { id: "heading", label: "Heading", type: "text", value: "" },
    { id: "description", label: "Description", type: "textarea", value: "" },
    { id: "image", label: "Image", type: "image", value: "" },
  ],
});

export default function AdminContentManager({ moduleId }: AdminContentManagerProps) {
  const [module, setModule] = React.useState<AdminModule | null>(null);
  const [records, setRecords] = React.useState<AdminContentRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteRecord, setDeleteRecord] = React.useState<AdminContentRecord | null>(null);

  const [prevModuleId, setPrevModuleId] = React.useState(moduleId);
  if (moduleId !== prevModuleId) {
    setPrevModuleId(moduleId);
    setLoading(true);
  }

  React.useEffect(() => {
    let active = true;
    adminContentService.getModuleById(moduleId).then(data => {
      if (active) {
        if (data) {
          setModule(data);
          setRecords(data.records);
        }
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [moduleId]);

  const handleFieldChange = (recordId: string, field: AdminSectionField) => {
    setRecords(prev =>
      prev.map(rec => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          fields: rec.fields.map(item => (item.id === field.id ? field : item)),
        };
      })
    );
  };

  const handleMetaChange = (recordId: string, key: "title" | "type" | "status", value: string) => {
    setRecords(prev =>
      prev.map(rec => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          [key]: value,
        };
      })
    );
  };

  const handleAddSection = () => {
    const newSec = blankSection();
    setRecords(prev => [newSec, ...prev]);
    toast.success("Added new blank section card at the top.");
  };

  const handleSave = async (record: AdminContentRecord) => {
    if (!record.title.trim()) {
      toast.error("Section title is required.");
      return;
    }

    try {
      const saved = await adminContentService.saveSection(record, moduleId);
      setRecords(prev =>
        prev.map(rec => (rec.id === record.id ? saved : rec))
      );
      toast.success(`"${record.title}" saved successfully.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save section.";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!deleteRecord) {
      return;
    }

    if (deleteRecord.id.startsWith("section-")) {
      setRecords(prev => prev.filter(record => record.id !== deleteRecord.id));
      setDeleteRecord(null);
      toast.success("Draft section card removed.");
      return;
    }

    try {
      await adminContentService.deleteSection(deleteRecord.id, moduleId);
      setRecords(prev => prev.filter(record => record.id !== deleteRecord.id));
      setDeleteRecord(null);
      toast.success("Section deleted from database.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete section.";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">Loading content module sections...</Typography>
      </Box>
    );
  }

  if (!module) {
    return (
      <>
        <AdminBreadcrumb items={[{ label: "Content" }, { label: "Not found" }]} />
        <AdminPageHeader title="Module not found" description="This admin content module does not exist." />
      </>
    );
  }

  return (
    <>
      <AdminBreadcrumb items={[{ label: "Content" }, { label: module.title }]} />
      <AdminPageHeader
        title={module.title}
        description={module.description}
        actionLabel="Add section"
        actionIcon={<AddRoundedIcon />}
        onAction={handleAddSection}
      >
        <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: "customColors.lightCream" }}>
          <Typography variant="caption" color="text.secondary">
            Frontend route: {module.route}
          </Typography>
        </Box>
      </AdminPageHeader>

      <Box sx={{ mt: 3 }}>
        {records.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", border: "1px dashed", borderColor: "divider" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sections in this page yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create sections to build the layout for this route.
            </Typography>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleAddSection}>
              Add first section
            </Button>
          </Paper>
        ) : (
          records.map(record => (
            <Paper
              key={record.id}
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2.5,
                bgcolor: "background.paper",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {record.title || "Unnamed Section"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Section ID: {record.id} | Last updated: {record.updatedAt}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 140 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Content Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
                    {record.type}
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    required
                    label="Section title"
                    value={record.title}
                    onChange={event => handleMetaChange(record.id, "title", event.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Content type"
                    value={record.type}
                    onChange={event => handleMetaChange(record.id, "type", event.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={record.status}
                      onChange={event => handleMetaChange(record.id, "status", event.target.value as AdminStatus)}
                    >
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={3}>
                {record.fields.map(field => (
                  <Box key={field.id}>
                    <SectionFieldEditor
                      field={field}
                      onChange={updatedField => handleFieldChange(record.id, updatedField)}
                    />
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => setDeleteRecord(record)}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Delete section
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveRoundedIcon />}
                  onClick={() => handleSave(record)}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Save section
                </Button>
              </Stack>
            </Paper>
          ))
        )}
      </Box>

      <ConfirmDialog
        open={Boolean(deleteRecord)}
        title="Delete section?"
        description={`This will permanently remove "${deleteRecord?.title ?? "this section"}" from the CMS database.`}
        onCancel={() => setDeleteRecord(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
