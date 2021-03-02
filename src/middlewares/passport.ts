import { IUser } from '@/types/types';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
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
                    done(null, false, { message: 'Incorrect credentials.' });
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

passport.use(
    'auth-facebook',
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `/api/auth/callback/facebook`,
            profileFields: ['id', 'profileUrl', 'email', 'displayName', 'name', 'picture.type(large)']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const fbProfile = profile._json;
                console.log(fbProfile)
                const user = await User.findOne({ provider_id: fbProfile.id });

                if (user) {
                    return done(null, user);
                } else {
                    const randomString = Math.random().toString(36).substring(2);
                    const photo = fbProfile.picture ? { public_id: fbProfile.id, url: fbProfile.picture.data.url } : null;

                    const newUser = new User({
                        email: fbProfile.email,
                        password: randomString,
                        name: fbProfile.name,
                        photo,
                        provider_id: fbProfile.id,
                        provider: 'facebook',
                    });

                    newUser.save(function (err) {
                        if (err) {
                            done(null, false, err);  // handle errors!
                        } else {
                            console.log('SUCCESSFULL CREATED', newUser);
                            done(null, newUser);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
                return done(err);
            }
        }
    )
)

passport.use(
    'auth-google',
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `/api/auth/callback/google`,
            passReqToCallback: true
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile)
                const user = await User.findOne({ provider_id: profile.id });

                if (user) {
                    return done(null, user);
                } else {
                    const randomString = Math.random().toString(36).substring(2);
                    const photo = profile.picture ? { public_id: profile.id, url: profile.picture } : null;

                    const newUser = new User({
                        email: profile.email,
                        password: randomString,
                        name: profile.displayName,
                        photo,
                        provider_id: profile.id,
                        provider: 'google',
                    });

                    newUser.save(function (err) {
                        if (err) {
                            done(null, false, err);
                        } else {
                            console.log('SUCCESSFULL CREATED', newUser);
                            done(null, newUser);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
                return done(err);
            }
        }
    )
)

export default passport;
