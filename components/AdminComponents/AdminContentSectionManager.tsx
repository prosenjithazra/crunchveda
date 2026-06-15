"use client";

import type { AdminContentRecord, AdminModule, AdminSectionField, AdminStatus } from "@/json/mock/admin";
import { adminContentService } from "@/services/admin/contentService";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography, Paper, Divider } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminPageHeader from "./AdminPageHeader";
import { SectionFieldEditor } from "./AdminFormFields";
import CategoryCardsEditor from "./CategoryCardsEditor";

type AdminContentSectionManagerProps = {
  moduleId: string;
  sectionId: string;
};

export default function AdminContentSectionManager({ moduleId, sectionId }: AdminContentSectionManagerProps) {
  const [module, setModule] = React.useState<AdminModule | null>(null);
  const [record, setRecord] = React.useState<AdminContentRecord | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [prevParams, setPrevParams] = React.useState({ moduleId, sectionId });
  if (moduleId !== prevParams.moduleId || sectionId !== prevParams.sectionId) {
    setPrevParams({ moduleId, sectionId });
    setLoading(true);
  }

  React.useEffect(() => {
    let active = true;
    adminContentService.getModuleById(moduleId).then(data => {
      if (active) {
        if (data) {
          setModule(data);
          const rec = data.records.find(r => r.id === sectionId);
          if (rec) {
            setRecord(rec);
          }
        }
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [moduleId, sectionId]);

  const handleFieldChange = (field: AdminSectionField) => {
    setRecord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        fields: prev.fields.map(item => (item.id === field.id ? field : item)),
      };
    });
  };

  const handleMetaChange = (key: "title" | "type" | "status", value: string) => {
    setRecord(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!record) return;

    if (!record.title.trim()) {
      toast.error("Section title is required.");
      return;
    }

    try {
      const saved = await adminContentService.saveSection(record, moduleId);
      setRecord(saved);
      toast.success(`"${record.title}" saved successfully.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save section.";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">Loading section editor...</Typography>
      </Box>
    );
  }

  if (!module || !record) {
    return (
      <>
        <AdminBreadcrumb items={[{ label: "Content" }, { label: "Not found" }]} />
        <AdminPageHeader title="Section not found" description="This section does not exist in this module." />
      </>
    );
  }

  return (
    <Box component="form" onSubmit={handleSave}>
      <AdminBreadcrumb
        items={[
          { label: "Content" },
          { label: module.title },
          { label: record.title }
        ]}
      />
      <AdminPageHeader
        title={record.title}
        description={`Edit configuration and fields for the ${record.title} section.`}
      >
        <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: "customColors.lightCream" }}>
          <Typography variant="caption" color="text.secondary">
            Module: {module.title} | Route: {module.route}
          </Typography>
        </Box>
      </AdminPageHeader>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mt: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2.5,
          bgcolor: "background.paper",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                required
                label="Section title"
                value={record.title}
                onChange={event => handleMetaChange("title", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Content type"
                value={record.type}
                onChange={event => handleMetaChange("type", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={record.status}
                  onChange={event => handleMetaChange("status", event.target.value as AdminStatus)}
                >
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={3}>
          {(record.id === "home-categories" || record.id === "categories-grid") && (
            <Box>
              <CategoryCardsEditor
                record={record}
                onChange={setRecord}
              />
              <Divider sx={{ my: 3 }} />
            </Box>
          )}

          {record.fields
            .filter(field => {
              if (record.id === "home-categories" || record.id === "categories-grid") {
                return field.id !== "cards" && field.id !== "imageSet";
              }
              return true;
            })
            .map(field => (
              <Box key={field.id}>
                <SectionFieldEditor
                  field={field}
                  onChange={handleFieldChange}
                />
              </Box>
            ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveRoundedIcon />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Save changes
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
