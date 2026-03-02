"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProfile } from "@/app/(dashboard)/settings/_actions/settings";
import type { Profile } from "@/types/database";
import { User, Building2, CreditCard, Share2, Settings } from "lucide-react";

type SettingsFormProps = {
  profile: Profile;
};

export function SettingsForm({ profile }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      const result = await updateProfile({
        full_name: (formData.get("full_name") as string) ?? "",
        display_name: (formData.get("display_name") as string) ?? "",
        phone: (formData.get("phone") as string) ?? "",
        legal_name: (formData.get("legal_name") as string) ?? "",
        tax_id: (formData.get("tax_id") as string) ?? "",
        address: {
          street: (formData.get("address_street") as string) ?? "",
          city: (formData.get("address_city") as string) ?? "",
          postal_code: (formData.get("address_postal_code") as string) ?? "",
          country: (formData.get("address_country") as string) ?? "",
        },
        bank_details: {
          iban: (formData.get("bank_iban") as string) ?? "",
          swift: (formData.get("bank_swift") as string) ?? "",
          bank_name: (formData.get("bank_name") as string) ?? "",
        },
        instagram_handle: (formData.get("instagram_handle") as string) ?? "",
        tiktok_handle: (formData.get("tiktok_handle") as string) ?? "",
        youtube_handle: (formData.get("youtube_handle") as string) ?? "",
        currency: (formData.get("currency") as string) ?? "EUR",
        timezone: (formData.get("timezone") as string) ?? "UTC",
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage("Settings saved successfully.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-mint" />
            Personal Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name ?? ""}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile.display_name ?? ""}
                placeholder="How you appear in the app"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                readOnly
                disabled
                className="cursor-not-allowed opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone ?? ""}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-orange" />
            Business Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="legal_name">Legal Name</Label>
              <Input
                id="legal_name"
                name="legal_name"
                defaultValue={profile.legal_name ?? ""}
                placeholder="Legal entity or personal name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
              <Input
                id="tax_id"
                name="tax_id"
                defaultValue={profile.tax_id ?? ""}
                placeholder="e.g. ES12345678A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_street">Street Address</Label>
            <Input
              id="address_street"
              name="address_street"
              defaultValue={profile.address?.street ?? ""}
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="address_city">City</Label>
              <Input
                id="address_city"
                name="address_city"
                defaultValue={profile.address?.city ?? ""}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_postal_code">Postal Code</Label>
              <Input
                id="address_postal_code"
                name="address_postal_code"
                defaultValue={profile.address?.postal_code ?? ""}
                placeholder="28001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_country">Country</Label>
              <Input
                id="address_country"
                name="address_country"
                defaultValue={profile.address?.country ?? ""}
                placeholder="Spain"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-coral" />
            Bank Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank_iban">IBAN</Label>
            <Input
              id="bank_iban"
              name="bank_iban"
              defaultValue={profile.bank_details?.iban ?? ""}
              placeholder="ES91 2100 0418 4502 0005 1332"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bank_swift">SWIFT / BIC</Label>
              <Input
                id="bank_swift"
                name="bank_swift"
                defaultValue={profile.bank_details?.swift ?? ""}
                placeholder="CAIXESBBXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                name="bank_name"
                defaultValue={profile.bank_details?.bank_name ?? ""}
                placeholder="CaixaBank"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Handles */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5 text-mint" />
            Social Handles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="instagram_handle">Instagram</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="instagram_handle"
                  name="instagram_handle"
                  defaultValue={profile.instagram_handle ?? ""}
                  placeholder="yourhandle"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok_handle">TikTok</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="tiktok_handle"
                  name="tiktok_handle"
                  defaultValue={profile.tiktok_handle ?? ""}
                  placeholder="yourhandle"
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_handle">YouTube</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="youtube_handle"
                  name="youtube_handle"
                  defaultValue={profile.youtube_handle ?? ""}
                  placeholder="yourchannel"
                  className="pl-7"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-orange" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select name="currency" defaultValue={profile.currency ?? "EUR"}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select name="timezone" defaultValue={profile.timezone ?? "UTC"}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Europe/Madrid">
                    Europe/Madrid (CET)
                  </SelectItem>
                  <SelectItem value="Europe/London">
                    Europe/London (GMT)
                  </SelectItem>
                  <SelectItem value="Europe/Paris">
                    Europe/Paris (CET)
                  </SelectItem>
                  <SelectItem value="Europe/Berlin">
                    Europe/Berlin (CET)
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    America/New_York (ET)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    America/Los_Angeles (PT)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    America/Chicago (CT)
                  </SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback messages */}
      {successMessage && (
        <p className="text-sm font-medium text-mint">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-sm font-medium text-coral">{errorMessage}</p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" variant="accent" size="lg" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
