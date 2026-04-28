import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Globe, Rocket } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";

export function CampusRegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    slug: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("campuses").insert([
        {
          name: formData.name,
          domain: formData.domain.toLowerCase(),
          slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
        },
      ]);

      if (error) throw error;

      showToast({
        variant: "success",
        title: "Campus Registered!",
        description: `${formData.name} is now part of VERTO.`,
      });
      navigate("/");
    } catch (error: any) {
      showToast({
        variant: "error",
        title: "Registration failed",
        description: error.message || "Failed to register campus. Ensure the domain/slug is unique.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Register your Campus
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bring VERTO to your university and give your students a secure place to find what's lost.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField id="name" label="Campus Name" required hint="e.g. Kamaraj College of Engineering">
              <Input
                id="name"
                placeholder="Full name of the organization"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>

            <FormField id="domain" label="Official Email Domain" required hint="e.g. kamarajengg.edu.in">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="domain"
                  className="pl-10"
                  placeholder="university.edu.in"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  required
                />
              </div>
            </FormField>

            <FormField id="slug" label="URL Slug" required hint="e.g. 'kamaraj' for verto.com/c/kamaraj">
              <Input
                id="slug"
                placeholder="unique-identifier"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </FormField>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <Rocket className="h-4 w-4" />
              Register Organization
            </Button>
          </form>
        </Card>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex gap-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
            <div>
              <p className="font-bold">Auto-Verification</p>
              <p className="text-sm text-muted-foreground">Students with your domain will auto-join.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
            <div>
              <p className="font-bold">Private & Secure</p>
              <p className="text-sm text-muted-foreground">Only your students can see your campus feed.</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
