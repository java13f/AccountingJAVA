package org.kaznalnrprograms.Accounting.Users.Interfaces;

import org.kaznalnrprograms.Accounting.Users.Models.UsersViewModel;

import java.util.List;

public interface IUsersDao {
    /**
     * Получить список пользователей
     * @param showDel - флаг отображения удалённых записей
     */
    List<UsersViewModel> List(boolean showDel, String filter) throws Exception;
}
