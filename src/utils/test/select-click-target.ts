import { screen, within } from "@testing-library/react";

export const selectClickTarget = async (id: string)=>{
    return within(await screen.findByTestId(id)).getByRole("combobox");
}

