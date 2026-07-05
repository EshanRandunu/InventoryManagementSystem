import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./app/AppRoutes", () => function MockAppRoutes() {
  return <div>App routes loaded</div>;
});

test("renders the app route container", () => {
  render(<App />);

  expect(screen.getByText(/app routes loaded/i)).toBeInTheDocument();
});
