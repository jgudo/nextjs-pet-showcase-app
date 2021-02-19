import { IUser } from '@/types/types';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models';

passport.serializeUser((user: IUser, done) => {
    done(null, user._id);
});

// passport#160
passport.deserializeUser((id, done) => {
    User.findById(id, function (err: any, user: IUser) {
        if (err) {
            console.log('ERR', err)
            return done(err);
        }
        done(null, user);
    });
});

passport.use(
    'local-login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (user && (await bcrypt.compare(password, user.password))) {
                    done(null, user);
                } else {
                    done(null, false, { message: 'Email or password is incorrect' });
                }
            } catch (err) {
                console.log('ERRRR-----', err);
                return done(err);
            }
        },
    ),
);

passport.use(
    'local-register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                console.log('PASSSS -------------', req.body)
                const { name } = req.body;
                const user = await User.findOne({ email });

                if (user) {
                    done(null, false, { message: 'Email already taken.' })
                } else {
                    const newUser = new User({ email, password, name });
                    await newUser.save();

                    done(null, newUser);
                }
            } catch (err) {
                console.log('ERRRR--', err)
                return done(err);
            }
        },
    ),
);

export default passport;
