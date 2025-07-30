"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Card className="shadow-lg border-0 w-full max-w-md">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            className="w-20 rounded-full h-20 mx-auto"
            src={session.user?.image as string}
            alt="User avatar"
          />
          <h1 className="text-center text-xl">{session.user?.name}</h1>
          
          <div className="space-y-2">
            <Link href="/vendors">
              <Button className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white border border-blue-800 shadow-sm">
                Manage Vendors
              </Button>
            </Link>
            
            <Button
              onClick={() => signOut()}
              className="w-full h-12 text-base font-medium bg-red-500 hover:bg-red-600 text-white border border-red-800 shadow-sm"
            >
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 w-full max-w-md bg-[#f4f4f4]">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <h1 className="text-center">You are not logged in</h1>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            onClick={() => signIn("google")}
            className="w-full h-12 text-base font-medium bg-stone-300 hover:bg-gray-300 text-gray-800 border hover:border-gray-800 shadow-sm"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
