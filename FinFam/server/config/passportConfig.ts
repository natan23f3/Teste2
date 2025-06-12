import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { db } from '../server';
import { users } from '../models/User';
import { eq } from 'drizzle-orm';

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, email));
      const user = userResult[0];

      if (!user) {
        return done(null, false, { message: 'Email incorreto.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.senha);

      if (!passwordMatch) {
        return done(null, false, { message: 'Senha incorreta.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const userResult = await db.select().from(users).where(eq(users.id, id));
    const user = userResult[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;