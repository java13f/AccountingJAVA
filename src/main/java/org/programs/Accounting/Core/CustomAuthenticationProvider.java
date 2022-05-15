package org.kaznalnrprograms.Accounting.Core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class CustomAuthenticationProvider extends DaoAuthenticationProvider {
    @Autowired
    private IUserSysDao dUser;
    @Autowired
    private HttpServletRequest req;

    @Override
    public Authentication authenticate(Authentication auth){
        HttpSession session = req.getSession();
        UserModel user = null;
        try {
            user = dUser.getByCode(auth.getName());
        } catch (Exception e) {
            throw new BadCredentialsException( e.getMessage());
        }
        if(user == null){
            throw new BadCredentialsException("Неверный логин или пароль");
        }
        session.setAttribute("UserName", user.getName());
        Authentication result = super.authenticate(auth);
        return new UsernamePasswordAuthenticationToken(result.getPrincipal(), result.getCredentials(), result.getAuthorities());
    }
    @Override
    public boolean supports(Class<?> authentication){
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
