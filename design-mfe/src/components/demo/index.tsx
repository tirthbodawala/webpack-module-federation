import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Paper,
  rem,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowsUpDown,
  IconDownload,
  IconEye,
  IconFilter,
  IconPencil,
} from "@tabler/icons-react";
import type { FC } from "react";

const rows = [
  {
    masterName: "Address Type",
    masterCode: "ADDTYP",
    value: "Home Address",
    code: "Home",
    createdBy: "Chanchal Gupta",
    createdOn: "01/08/2025 6:42 PM",
    approvedBy: "CRISIL",
  },
  {
    masterName: "Address Type",
    masterCode: "ADDTYP",
    value: "office",
    code: "off",
    createdBy: "CRISIL Administrator",
    createdOn: "24/09/2025 1:18 PM",
    approvedBy: "CRISIL",
  },
  {
    masterName: "Address Type",
    masterCode: "ADDTYP",
    value: "Business1",
    code: "12",
    createdBy: "CRISIL Administrator",
    createdOn: "10/07/2025 12:29 PM",
    approvedBy: "CRISIL",
  },
  {
    masterName: "Address Type",
    masterCode: "ADDTYP",
    value: "D3",
    code: "D2",
    createdBy: "CRISIL Administrator",
    createdOn: "29/08/2025 1:32 PM",
    approvedBy: "CRISIL",
  },
  {
    masterName: "Address Type",
    masterCode: "ADDTYP",
    value: "New Address",
    code: "New",
    createdBy: "Chanchal Gupta",
    createdOn: "01/08/2025 6:44 PM",
    approvedBy: "CRISIL",
  },
  {
    masterName: "Address Type",
    masterCode: "ADDTYP",
    value: "Local",
    code: "11",
    createdBy: "CRISIL Administrator",
    createdOn: "10/07/2025 12:28 PM",
    approvedBy: "CRISIL",
  },
];

export const Demo:FC = () => {
  return (
    <Box p="md">
      {/* Header: Title */}
      <Group justify="space-between" mb="xs">
        <Title order={2} fw={700}>
          Code Value Master
        </Title>
      </Group>

      {/* Tabs + right actions */}
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" align="center" mb="sm">

          <Group gap="xs">
            <Badge
              variant="light"
              radius="md"
              size="lg"
              styles={{
                root: {
                  backgroundColor: "var(--mantine-color-gray-1)",
                  border: `1px solid var(--mantine-color-gray-3)`,
                  fontWeight: 600,
                },
              }}
            >
              Approved
            </Badge>

            <ActionIcon variant="default" aria-label="Filter" radius="md" size="lg">
              <IconFilter size={18} />
            </ActionIcon>
            <ActionIcon variant="default" aria-label="Download" radius="md" size="lg">
              <IconDownload size={18} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Table */}
        <Box
          style={{
            border: `1px solid var(--mantine-color-gray-3)`,
            borderRadius: rem(8),
            overflow: "hidden",
          }}
        >
          <Table
            highlightOnHover
            horizontalSpacing="md"
            verticalSpacing="sm"
            stickyHeader
            withRowBorders={false}
          >
            <Table.Thead
              style={{
                background: "var(--mantine-color-gray-1)",
                borderBottom: `1px solid var(--mantine-color-gray-3)`,
              }}
            >
              <Table.Tr>
                <SortableTh>Master Name</SortableTh>
                <SortableTh>Master Code</SortableTh>
                <SortableTh>Value</SortableTh>
                <SortableTh>Code</SortableTh>
                <SortableTh>Created By</SortableTh>
                <SortableTh>Created On</SortableTh>
                <SortableTh>Approved By</SortableTh>
                <Table.Th style={{ width: 110 }}>
                  <Text size="sm" c="dimmed">
                    Action
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {rows.map((r, i) => (
                <Table.Tr key={i} style={{ borderBottom: `1px solid var(--mantine-color-gray-3)` }}>
                  <Table.Td>{r.masterName}</Table.Td>
                  <Table.Td>{r.masterCode}</Table.Td>
                  <Table.Td>{r.value}</Table.Td>
                  <Table.Td>{r.code}</Table.Td>
                  <Table.Td>{r.createdBy}</Table.Td>
                  <Table.Td>{r.createdOn}</Table.Td>
                  <Table.Td>{r.approvedBy}</Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-start">
                      <ActionIcon variant="subtle" aria-label="View">
                        <IconEye size={18} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" aria-label="Edit">
                        <IconPencil size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

const SortableTh:FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Table.Th>
      <Group gap={6} wrap="nowrap">
        <Text size="sm" c="dimmed">
          {children}
        </Text>
        <IconArrowsUpDown size={14} style={{ opacity: 0.7 }} />
      </Group>
    </Table.Th>
  );
}
