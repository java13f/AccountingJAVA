package org.kaznalnrprograms.Accounting.jrInvProtocol.Interfaces;

import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolAccModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolInvModel;
import org.kaznalnrprograms.Accounting.jrInvProtocol.Models.jrInvProtocolKterModel;
import java.util.List;

public interface IjrInvProtocolDao {
    List<jrInvProtocolKterModel> getKters() throws Exception;
    List<jrInvProtocolAccModel> getAccs() throws Exception;
    jrInvProtocolInvModel getInv(int id) throws Exception;
}
