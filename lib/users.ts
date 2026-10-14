import { randomBytes } from "crypto";
import { User } from "@/models/User";
import { Organization } from "@/models/Organization";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "workspace";
}

/** Creates a user as OWNER of a brand-new organization. */
export async function createUserWithOrg(input: {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
}) {
  const user = new User({ ...input, email: input.email.toLowerCase(), role: "OWNER" });
  const org = await Organization.create({
    name: `${input.name}'s workspace`,
    slug: `${slugify(input.name)}-${randomBytes(3).toString("hex")}`,
    owner: user._id,
  });
  user.organization = org._id;
  await user.save();
  return user;
}
