import { useState } from "react";
import { Container, Divider, Stack, Typography } from "@mui/material";
import { HardwareConfig, ServerModel } from "./types/types";
import { decideServerModels } from "./utils";
import { ServerModelOptions, Form } from "./components";

function App() {
  const [changed, setChanged] = useState(true);
  const [serverModelOptions, setServerModelOptions] = useState<
    ServerModel[] | null
  >(null);

  const handleSubmit = (hardwareConfig: HardwareConfig) => {
    setServerModelOptions(decideServerModels(hardwareConfig));
    setChanged(false);
  };

  return (
    <Container>
      <Typography variant="h1" style={{ fontSize: 36, padding: "16px 0" }}>
        Server Composer
      </Typography>
      <Stack
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        <Form onSubmit={handleSubmit} setChanged={setChanged} />
        {!changed && <ServerModelOptions value={serverModelOptions ?? []} />}
      </Stack>
    </Container>
  );
}

export default App;
