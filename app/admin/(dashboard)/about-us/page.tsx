/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import { adminAuthService } from "@/services/admin/authService";

type SectionKey = "banner" | "stewardship" | "journey" | "quote" | "charter";

type JourneyCard = {
  title: string;
  description: string;
  image: string;
};

type CharterItem = {
  title: string;
  description: string;
};

export default function AboutUsAdminPage() {
  const [activeTab, setActiveTab] = useState<SectionKey>("banner");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchSectionData = async (section: SectionKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/about-us/${section}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch section data");
      const json = await res.json();
      if (json.status === "success" && json.data?.[section]) {
        setFormData(json.data[section]);
      } else {
        setFormData({});
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error loading ${section} section data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSectionData(activeTab);
  }, [activeTab]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const getJourneyCards = (): JourneyCard[] => {
    const stepLines = String(formData.steps || "")
      .split("\n")
      .filter((line) => line.trim() || line.includes("|"));
    const imageLines = String(formData.imageSet || "").split("\n");
    const cardCount = Math.max(
      stepLines.length,
      imageLines.filter(Boolean).length,
      1,
    );

    return Array.from({ length: cardCount }, (_, index) => {
      const [title = "", description = ""] = (stepLines[index] || "").split(
        "|",
      );
      return {
        title: title.trim(),
        description: description.trim(),
        image: (imageLines[index] || "").trim(),
      };
    });
  };

  const updateJourneyCards = (cards: JourneyCard[]) => {
    const steps = cards
      .map((card) => `${card.title.trim()} | ${card.description.trim()}`)
      .join("\n");
    const imageSet = cards.map((card) => card.image.trim()).join("\n");

    setFormData((prev: any) => ({
      ...prev,
      steps,
      imageSet,
    }));
  };

  const handleJourneyCardChange = (
    index: number,
    key: keyof JourneyCard,
    value: string,
  ) => {
    const cards = getJourneyCards();
    cards[index] = { ...cards[index], [key]: value };
    updateJourneyCards(cards);
  };

  const handleAddJourneyCard = () => {
    updateJourneyCards([
      ...getJourneyCards(),
      { title: "", description: "", image: "" },
    ]);
  };

  const handleRemoveJourneyCard = (index: number) => {
    const cards = getJourneyCards().filter(
      (_, cardIndex) => cardIndex !== index,
    );
    updateJourneyCards(
      cards.length ? cards : [{ title: "", description: "", image: "" }],
    );
  };

  const getCharterItems = (): CharterItem[] => {
    const lines = String(formData.charters || "")
      .split("\n")
      .filter((line) => line.trim() || line.includes("|"));

    const items = lines.map((line) => {
      const [title = "", description = ""] = line.split("|");
      return {
        title: title.trim(),
        description: description.trim(),
      };
    });

    return items.length ? items : [{ title: "", description: "" }];
  };

  const updateCharterItems = (items: CharterItem[]) => {
    const charters = items
      .map((item) => `${item.title.trim()} | ${item.description.trim()}`)
      .join("\n");

    setFormData((prev: any) => ({
      ...prev,
      charters,
    }));
  };

  const handleCharterItemChange = (
    index: number,
    key: keyof CharterItem,
    value: string,
  ) => {
    const items = getCharterItems();
    items[index] = { ...items[index], [key]: value };
    updateCharterItems(items);
  };

  const handleAddCharterItem = () => {
    updateCharterItems([...getCharterItems(), { title: "", description: "" }]);
  };

  const handleRemoveCharterItem = (index: number) => {
    const items = getCharterItems().filter(
      (_, itemIndex) => itemIndex !== index,
    );
    updateCharterItems(items.length ? items : [{ title: "", description: "" }]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const session = adminAuthService.getSession();
      const token = session?.token || "";

      const res = await fetch(`/api/about-us/${activeTab}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const json = await res.json();
      if (json.status === "success") {
        toast.success("Section updated successfully.");
      } else {
        throw new Error(json.message || "Failed to save changes");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const renderFormFields = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    switch (activeTab) {
      case "banner":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Hero subtitle (Eyebrow)"
                value={formData.bannerLabel || ""}
                onChange={(e) =>
                  handleFieldChange("bannerLabel", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Hero Image URL"
                value={formData.bannerImage || ""}
                onChange={(e) =>
                  handleFieldChange("bannerImage", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="H1 headline"
                value={formData.bannerTitle || ""}
                onChange={(e) =>
                  handleFieldChange("bannerTitle", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Hero description paragraph"
                value={formData.bannerDescription || ""}
                onChange={(e) =>
                  handleFieldChange("bannerDescription", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) =>
                      handleFieldChange("showSection", e.target.checked)
                    }
                  />
                }
                label="Show Banner Section"
              />
            </Grid>
          </Grid>
        );

      case "stewardship":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Eyebrow"
                value={formData.eyebrow || ""}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Heading"
                value={formData.heading || ""}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image || ""}
                onChange={(e) => handleFieldChange("image", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Badge Number (e.g. 100+)"
                value={formData.badgeNumber || ""}
                onChange={(e) =>
                  handleFieldChange("badgeNumber", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Badge Text"
                value={formData.badgeText || ""}
                onChange={(e) => handleFieldChange("badgeText", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Quote"
                value={formData.quote || ""}
                onChange={(e) => handleFieldChange("quote", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) =>
                      handleFieldChange("showSection", e.target.checked)
                    }
                  />
                }
                label="Show Stewardship Section"
              />
            </Grid>
          </Grid>
        );

      case "journey":
        const journeyCards = getJourneyCards();

        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Eyebrow"
                value={formData.eyebrow || ""}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Heading"
                value={formData.heading || ""}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
              />
            </Grid>

            {journeyCards.map((card, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ fontWeight: 600 }}>Card {index + 1}</Box>
                      <Button
                        type="button"
                        color="error"
                        variant="outlined"
                        disabled={journeyCards.length === 1}
                        onClick={() => handleRemoveJourneyCard(index)}
                      >
                        Remove
                      </Button>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Card title"
                          value={card.title}
                          onChange={(e) =>
                            handleJourneyCardChange(
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Image URL"
                          value={card.image}
                          onChange={(e) =>
                            handleJourneyCardChange(
                              index,
                              "image",
                              e.target.value,
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Card description"
                          value={card.description}
                          onChange={(e) =>
                            handleJourneyCardChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleAddJourneyCard}
              >
                Add Card
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) =>
                      handleFieldChange("showSection", e.target.checked)
                    }
                  />
                }
                label="Show Artisanal Journey Section"
              />
            </Grid>
          </Grid>
        );

      case "quote":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Quote Text"
                value={formData.quote || ""}
                onChange={(e) => handleFieldChange("quote", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Author Attribution"
                value={formData.author || ""}
                onChange={(e) => handleFieldChange("author", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) =>
                      handleFieldChange("showSection", e.target.checked)
                    }
                  />
                }
                label="Show Philosophy Quote Section"
              />
            </Grid>
          </Grid>
        );

      case "charter":
        const charterItems = getCharterItems();

        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Heading"
                value={formData.heading || ""}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Report Link Href"
                value={formData.reportHref || ""}
                onChange={(e) =>
                  handleFieldChange("reportHref", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Report CTA Label"
                value={formData.reportLabel || ""}
                onChange={(e) =>
                  handleFieldChange("reportLabel", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </Grid>
            {charterItems.map((item, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ fontWeight: 600 }}>
                        Charter Item {index + 1}
                      </Box>
                      <Button
                        type="button"
                        color="error"
                        variant="outlined"
                        disabled={charterItems.length === 1}
                        onClick={() => handleRemoveCharterItem(index)}
                      >
                        Remove
                      </Button>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                          fullWidth
                          label="Item title"
                          value={item.title}
                          onChange={(e) =>
                            handleCharterItemChange(
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 7 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Item description"
                          value={item.description}
                          onChange={(e) =>
                            handleCharterItemChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleAddCharterItem}
              >
                Add Charter Item
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) =>
                      handleFieldChange("showSection", e.target.checked)
                    }
                  />
                }
                label="Show Sustainability Charter Section"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AdminBreadcrumb
        items={[
          { label: "Content", href: "/admin" },
          { label: "About Us Page" },
        ]}
      />
      <AdminPageHeader
        title="About Us Page Editor"
        description="Edit the content, descriptions, and media elements on the public About Us page."
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          aria-label="About Us page sections tabs"
        >
          <Tab value="banner" label="Hero Banner" />
          <Tab value="stewardship" label="Roots & Stewardship" />
          <Tab value="journey" label="Artisanal Journey" />
          <Tab value="quote" label="Philosophy Quote" />
          <Tab value="charter" label="Sustainability Charter" />
        </Tabs>
      </Box>

      <Paper
        sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 2 }}
        component="form"
        onSubmit={handleSave}
      >
        <Stack spacing={4}>
          <Box>{renderFormFields()}</Box>
          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || saving}
              sx={{ minWidth: 140 }}
            >
              {saving ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
