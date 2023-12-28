import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: "501094726325-e97g9drjb6vvdcc1luggr2ibd5amq9a4.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      let isAllowedToSignIn = false;
      if (
        profile.email == "alexandrabunch23@gmail.com" ||
        profile.email == "eric2008zheng@gmail.com" ||
        profile.email == "ritvikgupta011@gmail.com" ||
        profile.email == "xz.wired@gmail.com"
      ) {
        isAllowedToSignIn = true;
      }
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
  },
  secret: process.env.SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
