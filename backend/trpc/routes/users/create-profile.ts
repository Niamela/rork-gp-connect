import { publicProcedure } from '../../create-context';
import { CreateUserProfileSchema } from '../../../db/schema';
import { supabase } from '../../../db/supabase-client';
import { TRPCError } from '@trpc/server';

export const createProfileProcedure = publicProcedure
  .input(CreateUserProfileSchema)
  .mutation(async ({ input }) => {
    console.log('[createProfile] Starting profile creation with input:', input);

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('contact', input.contact)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('[createProfile] Error checking existing user:', checkError);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la vérification du contact',
        });
      }

      if (existingUser) {
        console.log('[createProfile] User already exists with contact:', input.contact);
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Un utilisateur avec ce contact existe déjà',
        });
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          first_name: input.firstName,
          last_name: input.lastName,
          country: input.country,
          contact: input.contact,
          password: input.password,
          is_verified: false,
          is_gp: input.isGP || false,
        })
        .select()
        .single();

      if (insertError || !newUser) {
        console.error('[createProfile] Error inserting user:', insertError);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la création du profil',
        });
      }

      console.log('[createProfile] User created successfully:', newUser.id);

      if (input.gpSubscription && input.isGP) {
        const { error: subError } = await supabase
          .from('gp_subscriptions')
          .insert({
            user_id: newUser.id,
            is_active: input.gpSubscription.isActive,
            start_date: input.gpSubscription.startDate,
            end_date: input.gpSubscription.endDate,
            amount: input.gpSubscription.amount,
          });

        if (subError) {
          console.error('[createProfile] Error creating GP subscription:', subError);
        }
      }

      const userProfile = {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        country: newUser.country,
        contact: newUser.contact,
        isVerified: newUser.is_verified,
        isGP: newUser.is_gp,
        createdAt: newUser.created_at,
      };

      console.log('[createProfile] Returning user profile:', userProfile);
      return userProfile;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('[createProfile] Unexpected error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erreur inattendue lors de la création du profil',
      });
    }
  });

export default createProfileProcedure;
