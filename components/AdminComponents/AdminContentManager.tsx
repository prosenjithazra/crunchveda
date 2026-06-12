"use client";

import type { AdminContentRecord, AdminModule, AdminSectionField, AdminStatus } from "@/json/mock/admin";
import { adminContentService } from "@/services/admin/contentService";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminDataTable, { type AdminTableColumn } from "./AdminDataTable";
import AdminModal from "./AdminModal";
import AdminPageHeader from "./AdminPageHeader";
import AdminStatusChip from "./AdminStatusChip";
import ConfirmDialog from "./ConfirmDialog";
import { SectionFieldEditor } from "./AdminFormFields";

type AdminContentManagerProps = {
  moduleId: string;
};

const blankSection = (): AdminContentRecord => ({
  id: `section-${Date.now()}`,
  title: "",
  type: "Section",
  status: "Draft",
  updatedAt: new Date().toISOString().slice(0, 10),
  fields: [
    { id: "heading", label: "Heading", type: "text", value: "" },
    { id: "description", label: "Description", type: "textarea", value: "" },
    { id: "image", label: "Image", type: "image", value: "" },
  ],
});

const columns: AdminTableColumn<AdminContentRecord>[] = [
  {
    key: "title",
    label: "Section",
    render: row => (
      <Stack spacing={0.5}>
        <Typography sx={{ fontWeight: 700 }}>{row.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {row.id}
        </Typography>
      </Stack>
    ),
  },
  { key: "type", label: "Content type", render: row => row.type },
  { key: "status", label: "Status", render: row => <AdminStatusChip status={row.status} /> },
  { key: "updated", label: "Updated", render: row => row.updatedAt },
];

export default function AdminContentManager({ moduleId }: AdminContentManagerProps) {
  const [module, setModule] = React.useState<AdminModule | null>(null);
  const [records, setRecords] = React.useState<AdminContentRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingRecord, setEditingRecord] = React.useState<AdminContentRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = React.useState<AdminContentRecord | null>(null);

  React.useEffect(() => {
    adminContentService.getModuleById(moduleId).then(data => {
      if (data) {
        setModule(data);
        setRecords(data.records);
      }
      setLoading(false);
    });
  }, [moduleId]);

  const handleFieldChange = (field: AdminSectionField) => {
    setEditingRecord(prev => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        fields: prev.fields.map(item => (item.id === field.id ? field : item)),
      };
    });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingRecord) {
      return;
    }

    if (!editingRecord.title.trim()) {
      toast.error("Section title is required.");
      return;
    }

    const saved = await adminContentService.saveSection(editingRecord);
    setRecords(prev => {
      const exists = prev.some(record => record.id === saved.id);
      return exists ? prev.map(record => (record.id === saved.id ? saved : record)) : [saved, ...prev];
    });
    setEditingRecord(null);
    toast.success("Section saved.");
  };

  const handleDelete = async () => {
    if (!deleteRecord) {
      return;
    }

    await adminContentService.deleteSection(deleteRecord.id);
    setRecords(prev => prev.filter(record => record.id !== deleteRecord.id));
    setDeleteRecord(null);
    toast.success("Section deleted.");
  };

  if (!loading && !module) {
    return (
      <>
        <AdminBreadcrumb items={[{ label: "Content" }, { label: "Not found" }]} />
        <AdminPageHeader title="Module not found" description="This admin content module does not exist." />
      </>
    );
  }

  return (
    <>
      <AdminBreadcrumb items={[{ label: "Content" }, { label: module?.title ?? "Loading" }]} />
      <AdminPageHeader
        title={module?.title ?? "Content module"}
        description={module?.description ?? "Loading content module."}
        actionLabel="Add section"
        actionIcon={<AddRoundedIcon />}
        onAction={() => setEditingRecord(blankSection())}
      >
        {module && (
          <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: "customColors.lightCream" }}>
            <Typography variant="caption" color="text.secondary">
              Frontend route: {module.route}
            </Typography>
          </Box>
        )}
      </AdminPageHeader>

      <AdminDataTable
        columns={columns}
        rows={records}
        loading={loading}
        getRowKey={row => row.id}
        emptyTitle="No sections yet"
        emptyDescription="Add a hero, banner, card list, text block, or image section."
        onEdit={row => setEditingRecord({ ...row, fields: row.fields.map(field => ({ ...field })) })}
        onDelete={row => setDeleteRecord(row)}
      />

      <AdminModal
        open={Boolean(editingRecord)}
        title={editingRecord?.id.startsWith("section-") ? "Add section" : "Edit section"}
        description="Update section copy, images, status, and structured fields."
        onClose={() => setEditingRecord(null)}
      >
        {editingRecord && (
          <Box component="form" onSubmit={handleSave}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Section title"
                  value={editingRecord.title}
                  onChange={event => setEditingRecord(prev => (prev ? { ...prev, title: event.target.value } : prev))}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Content type"
                  value={editingRecord.type}
                  onChange={event => setEditingRecord(prev => (prev ? { ...prev, type: event.target.value } : prev))}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={editingRecord.status}
                    onChange={event =>
                      setEditingRecord(prev => (prev ? { ...prev, status: event.target.value as AdminStatus } : prev))
                    }
                  >
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {editingRecord.fields.map(field => (
                <Grid key={field.id} size={{ xs: 12 }}>
                  <SectionFieldEditor field={field} onChange={handleFieldChange} />
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setEditingRecord(null)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save section
              </Button>
            </Stack>
          </Box>
        )}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteRecord)}
        title="Delete section?"
        description={`This will remove ${deleteRecord?.title ?? "this section"} from the admin mock data for this session.`}
        onCancel={() => setDeleteRecord(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
