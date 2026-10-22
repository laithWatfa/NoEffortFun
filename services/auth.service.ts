import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function ensureAuthenticated() {
    if (auth.currentUser) {
        return auth.currentUser;
    }

    const credential = await signInAnonymously(auth);

    return credential.user;
}