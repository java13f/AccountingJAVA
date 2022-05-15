package org.kaznalnrprograms.Accounting.Admin.Controllers;

import org.kaznalnrprograms.Accounting.Admin.Interfaces.IUsersDao;
import org.kaznalnrprograms.Accounting.Admin.Models.DepsModel;
import org.kaznalnrprograms.Accounting.Admin.Models.KterViewModel;
import org.kaznalnrprograms.Accounting.Admin.Models.UserModel;
import org.kaznalnrprograms.Accounting.Admin.Models.UserViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class AdminUsersController {
    private IUsersDao dUsers = null;
    public AdminUsersController(IUsersDao dUsers){
        this.dUsers = dUsers;
    }
    @GetMapping("/AdminUsers/UserEditForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String UserEditForm(){
        return "Admin/UserEditForm :: UserEditForm";
    }
    @GetMapping("/AdminUsers/UserFilterForm")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public String UserFilterForm(){
        return "Admin/UserFilterForm :: UserFilterForm";
    }

    /**
     * Получить список пользователей
     * @param code фильтер по части логина пользователя
     * @param name фильтер по части наименования
     * @param kterId фильтер по территории
     * @return
     * @throws Exception
     */
    @GetMapping("/AdminUsers/List")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<UserViewModel> List(@RequestParam (required = false, defaultValue = "") String code,
                                                  @RequestParam(required = false, defaultValue = "") String name,
                                                  @RequestParam(required = false, defaultValue = "-1") int kterId) throws Exception {
        return dUsers.List(code, name, kterId);
    }
    /**
     * Функция получения пользователя
     * @param id - идентификатор пользователя
     * @return
     * @throws Exception
     */
    @GetMapping("/AdminUsers/GetUser")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody UserModel GetUser(int id) throws Exception{
        return dUsers.GetUser(id);
    }
    /**
     * Проверка существования пользователя
     * @param id - идентификатор пользователя
     * @param code - логин ползователя
     * @return
     * @throws Exception
     */
    @GetMapping("/AdminUsers/ExistsUser")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody boolean ExistsUser(int id, String code) throws Exception {
        return dUsers.ExistsUser(id, code);
    }
    /**
     * Получить список территорий
     * @return
     * @throws Exception
     */
    @GetMapping("/AdminUsers/GetKtersUserEdit")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<KterViewModel> GetKtersUserEdit() throws Exception {
        return dUsers.GetKtersUserEdit();
    }
    /**
     * Получить список подразделений
     * @param KterId - идентификатор территории
     * @return
     */
    @GetMapping("/AdminUsers/GetDeps")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody List<DepsModel> GetDeps(int KterId) throws Exception{
        return dUsers.GetDeps(KterId);
    }
    /**
     * Добавить/изменить пользователя
     * @param model - модуль пользователя
     * @return
     * @throws Exception
     */
    @PostMapping("/AdminUsers/Save")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody int Save(@RequestBody UserModel model) throws Exception{
        String password = model.getPassword();
        String password2 = model.getPassword2();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(8);
        if(!password.isEmpty()){
            model.setPassword(passwordEncoder.encode(password));
        }
        if(!password.equals(password2)){
            throw new Exception("Пароли не совпадают");
        }
        return dUsers.Save(model);
    }
    /**
     * Удаление пользователя
     * @param id - идентификатор пользователя
     * @return
     */
    @PostMapping("/AdminUsers/Delete")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String Delete(Integer id) throws Exception{
        return dUsers.Delete(id);
    }
    /**
     * Получение строки представления пользователя для формы редактирования
     * @param id - идентификатор польбзователя
     */
    @GetMapping("/AdminUsers/GetUserSel")
    @PreAuthorize("GetActRight('Admin4.dll','AdminView')")
    public @ResponseBody String getUserSel(int id) throws Exception{
        return dUsers.getUserSel(id);
    }
}
