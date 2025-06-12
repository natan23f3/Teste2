import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { users, NewUser } from '../models/User';
import { db } from '../server';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Middleware para verificar a função do usuário
const checkRole = (role: string) => {
  return (req: any, res: any, next: any) => {
    if (req.user && req.user.funcao === role) {
      return next();
    }
    res.status(403).send('Acesso negado');
  };
};

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, funcao } = req.body;

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar um novo usuário
    const newUser: NewUser = {
      name: nome,
      email,
      password: hashedPassword,
      role: funcao,
    };

    // Salvar o usuário no banco de dados
    await db.insert(users).values(newUser);

    // Criar usuário de teste após o registro bem-sucedido
    const testUser: NewUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      role: 'tester',
    };
    

    res.status(201).send('Usuário registrado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao registrar usuário');
  }
});

// Rota de login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, email));
      const user = userResult[0];

      if (!user) {
        return done(null, false, { message: 'Email incorreto.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

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

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // Generate a token here (e.g., using JWT)
      const token = 'fake_token'; // Replace with actual token generation
      return res.status(200).json({ token });
    });
  })(req, res, next);
});

// Rota protegida para administradores
router.get('/admin', checkRole('admin'), (req: any, res) => {
  res.send('Rota de administrador');
});

// Rota protegida para membros da família
router.get('/family', checkRole('family'), (req: any, res) => {
  res.send('Rota de família');
});

export default router;