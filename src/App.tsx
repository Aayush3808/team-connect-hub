import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Join from "./pages/Join.tsx";
import NotFound from "./pages/NotFound.tsx";
import MemberLogin from "./components/swamn/MemberLogin.tsx";
import MemberWorkspace from "./pages/MemberWorkspace.tsx";
import MemberResetPassword from "./pages/MemberResetPassword.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/join" element={<Join />} />
         <Route path="/team" element={<MemberLogin />} />
         <Route path="/team/files" element={<MemberWorkspace />} />
         <Route path="/team/reset-password" element={<MemberResetPassword />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
