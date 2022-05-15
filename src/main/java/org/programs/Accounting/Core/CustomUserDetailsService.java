package org.kaznalnrprograms.Accounting.Core;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private IUserSysDao dUser;
    public CustomUserDetailsService(IUserSysDao dUser){
        this.dUser = dUser;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            UserModel user = dUser.getByCode(username);
            return new CustomPrincipal(user);
        } catch (Exception e) {
            throw new UsernameNotFoundException(username);
        }
    }
}
