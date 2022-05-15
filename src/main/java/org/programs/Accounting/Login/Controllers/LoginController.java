package org.kaznalnrprograms.Accounting.Login.Controllers;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.WebAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class LoginController {
    @GetMapping("/login")
    public String login(Model model, HttpServletRequest request){
        return "Login/LoginForm";
    }
    @GetMapping("/login-error")
    public String login_error(HttpServletRequest request, Model model) {
        HttpSession session = request.getSession();
        String errorMessage = null;
        if (session != null) {
            AuthenticationException ex = (AuthenticationException) session.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
            if (ex != null) {
                errorMessage = ex.getMessage();
                if(errorMessage.equals("Bad credentials")){
                    errorMessage = "Неверный логин или пароль";
                }
                model.addAttribute("errorMessage", errorMessage);
            }
        }
        return "Login/LoginForm";
    }
}
