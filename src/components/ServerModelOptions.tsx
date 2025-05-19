import { Grid, Typography } from "@mui/material";
import { ServerModel } from "../types/types";

interface ServerModelOptionsProps {
  value: ServerModel[];
}

export const ServerModelOptions = (props: ServerModelOptionsProps) => {
  const { value } = props;

  return (
    <Grid>
      <Typography variant="h2" style={{ fontSize: 18, padding: "16px 0" }}>
        Server Model Options
      </Typography>
      {value && value.length > 0 ? (
        <ul data-testid="server-model-options">
          {value.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      ) : (
        <Typography variant="body1" data-testid="server-model-options">
          No Options.
        </Typography>
      )}
    </Grid>
  );
};
