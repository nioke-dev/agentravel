
import { useState, useEffect } from "react";
import { User } from "@/types/userType";

export function useAuth() {
const [user, setUser] = useState<User>(null);

useEffect(() => {
try {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
    setUser(JSON.parse(raw));
    }
} catch (e) {
    console.error("Failed to parse currentUser from localStorage:", e);
    setUser(null);
}
}, []);

return { user };
}
