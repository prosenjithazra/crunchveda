"use client";

import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import { Button, FormControlLabel, Grid, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState({
    siteName: "Crunchveda",
    supportEmail: "support@crunchveda.com",
    orderPrefix: "CV",
    maintenanceMode: false,
    showDraftPreview: true,
  });

  const updateSetting = (patch: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  };

  return (
    <>
      <AdminBreadcrumb items={[{ label: "Settings" }]} />
      <AdminPageHeader
        title="Admin Settings"
        description="Mock settings for brand metadata, operational toggles, and future publishing controls."
      />

      <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        <Stack
          component="form"
          spacing={3}
          onSubmit={event => {
            event.preventDefault();
            toast.success("Settings saved.");
          }}
        >
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Site name"
                value={settings.siteName}
                onChange={event => updateSetting({ siteName: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="email"
                label="Support email"
                value={settings.supportEmail}
                onChange={event => updateSetting({ supportEmail: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Order prefix"
                value={settings.orderPrefix}
                onChange={event => updateSetting({ orderPrefix: event.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Publishing controls
              </Typography>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showDraftPreview}
                      onChange={event => updateSetting({ showDraftPreview: event.target.checked })}
                    />
                  }
                  label="Enable draft preview controls"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={event => updateSetting({ maintenanceMode: event.target.checked })}
                    />
                  }
                  label="Maintenance mode"
                />
              </Stack>
            </Grid>
          </Grid>
          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained">
              Save settings
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
