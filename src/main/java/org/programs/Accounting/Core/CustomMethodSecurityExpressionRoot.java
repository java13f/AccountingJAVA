package org.kaznalnrprograms.Accounting.Core;

import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

public class CustomMethodSecurityExpressionRoot
        extends SecurityExpressionRoot implements MethodSecurityExpressionOperations
{
    private IUserSysDao dUserSys;
    public CustomMethodSecurityExpressionRoot(Authentication authentication)
    {
        super(authentication);
    }
    public void setUserSysDao(IUserSysDao dUserSys){
        this.dUserSys = dUserSys;
    }

    public boolean GetActRight(String TaskCode, String ActCode) throws Exception {
        CustomPrincipal principal = (CustomPrincipal)this.getPrincipal();
        UserModel user = principal.getUser();
        String rights = dUserSys.GetActRights(TaskCode, ActCode);
        return rights.isEmpty();
    }
    @Override
    public void setFilterObject(Object o) {

    }

    @Override
    public Object getFilterObject() {
        return null;
    }

    @Override
    public void setReturnObject(Object o) {

    }

    @Override
    public Object getReturnObject() {
        return null;
    }

    @Override
    public Object getThis() {
        return null;
    }
}
