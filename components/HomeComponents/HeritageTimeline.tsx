'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';

import { HeritageTimelineWrapper } from '@/styles/StyledComponents/HeritageTimelineWrapper';
import { useContentModule } from '@/hooks/useContent';

const defaultEvents = [
  {
    id: 1,
    year: "1994",
    title: "The Seed is Sown",
    desc: "Founded as a small family orchard in the foothills, focused on traditional farming methods.",
    align: "left"
  },
  {
    id: 2,
    year: "2008",
    title: "Organic Certification",
    desc: "One of the first in the region to achieve global 100% organic certification for all our produce.",
    align: "right"
  },
  {
    id: 3,
    year: "2024",
    title: "NutriHarvest Global",
    desc: "Launching our digital experience to deliver premium health directly to your doorstep worldwide.",
    align: "left"
  }
];

export default function HeritageTimeline() {
  const { data: moduleData } = useContentModule("home");
  const timelineRecord = moduleData?.records?.find(r => r.id === "home-timeline");

  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = timelineRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const heading = getFieldValue("heading", "Our Heritage Journey");
  const description = getFieldValue("description", "Tracing our roots back to the finest organic orchards.");
  const eventsRaw = getFieldValue("events", "");

  let events = defaultEvents;
  if (eventsRaw && eventsRaw.trim()) {
    const lines = eventsRaw.split("\n").filter(Boolean);
    events = lines.map((line, idx) => {
      const parts = line.split("|");
      return {
        id: idx + 1,
        year: parts[0]?.trim() || "",
        title: parts[1]?.trim() || "",
        desc: parts[2]?.trim() || "",
        align: parts[3]?.trim() || (idx % 2 === 0 ? "left" : "right")
      };
    });
  }

  return (
    <HeritageTimelineWrapper>
      <Container fixed>
        <Box className='timeline_header'>
          <Typography variant='h2'>
            {heading}
          </Typography>
          <Typography variant='body1'>
            {description}
          </Typography>
        </Box>

        <Box className='timeline_container'>
          {events.map((event) => (
            <Box
              key={event.id}
              className={`timeline_event event_${event.align}`}
            >
              <Box className='event_node'>
                {event.id}
              </Box>
              <Typography variant='caption' className='event_year'>
                {event.year}
              </Typography>
              <Typography variant='h4' className='event_title'>
                {event.title}
              </Typography>
              <Typography variant='body2' className='event_desc'>
                {event.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </HeritageTimelineWrapper>
  );
}
