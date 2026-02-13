"use client";

import * as React from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  remember: z.boolean().default(false).optional(),
});

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = React.useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/library");
      } else {
        console.log(result);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 manga-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-mango-secondary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-block hover:scale-110 transition-transform duration-300">
            <span className="text-6xl">🥭</span>
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            Welcome <span className="text-primary">Back</span>
          </h1>
          <p className="text-muted-foreground font-medium">Continue your manga odyssey</p>
        </div>

        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl relative">
          {/* Decorative Corner */}
          <div className="absolute -top-3 -right-3 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl pointer-events-none" />
          
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your library
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase tracking-widest text-[10px]">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          className="bg-background/50 border-2 focus-visible:ring-primary h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-bold uppercase tracking-widest text-[10px]">Password</FormLabel>
                        <Link 
                          href="#" 
                          className="text-[10px] font-bold uppercase text-primary hover:underline"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-background/50 border-2 focus-visible:ring-primary h-12"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-2 border-primary/50 data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs font-medium cursor-pointer">
                          Stay signed in for 30 days
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 text-black font-black uppercase tracking-widest bg-primary hover:bg-primary/90 transition-all transform active:scale-95"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Authenticating..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center border-t border-primary/10 pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Join the Chapter
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Decorative Manga Text */}
        <div className="mt-8 flex justify-center opacity-10 select-none pointer-events-none">
          <span className="text-6xl font-black italic uppercase tracking-[0.5em] manga-halftone text-primary">LOGIN</span>
        </div>
      </div>
    </div>
  );
}
