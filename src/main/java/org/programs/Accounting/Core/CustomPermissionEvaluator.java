package org.kaznalnrprograms.Accounting.Core;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;

public class CustomPermissionEvaluator implements PermissionEvaluator {
    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        if((auth==null)||!(permission instanceof  String)){
            return false;
        }
        return hasPrivilege(auth, permission.toString().toUpperCase());
    }

    @Override
    public boolean hasPermission(Authentication auth, Serializable serializable, String targetType, Object permission) {
        if ((auth == null) || (targetType == null) || !(permission instanceof String)) {
            return false;
        }
        return hasPrivilege(auth, permission.toString().toUpperCase());
    }
    private boolean hasPrivilege(Authentication auth, String permission) {
        for (GrantedAuthority grantedAuth : auth.getAuthorities()) {
            if (grantedAuth.getAuthority().contains(permission)) {
                return true;
            }
        }
        return false;
    }
}
