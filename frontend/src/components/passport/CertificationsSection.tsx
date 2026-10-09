import { Box, Typography, Card, CardContent } from '@mui/material';

export default function CertificationsSection({ certs = [] }: any) {
  if (!certs.length) return null;
  return (
    <Box p={4} bgcolor="white" borderRadius={3} boxShadow={1}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Certifications</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {certs.map((c: any, i: number) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Typography variant="h6">{c.name}</Typography>
              <Typography color="text.secondary" variant="body2">Issued by: {c.issuingAuthority}</Typography>
              <Typography variant="caption" color="text.secondary">Valid: {c.issueDate} - {c.expirationDate}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
