package org.kaznalnrprograms.Accounting.Admin.Controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {
    @GetMapping("/Admin")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String getAdminMainForm()
    {
        return "Admin/AdminMainForm :: AdminMainForm";
    }
}
