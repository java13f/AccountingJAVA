package org.kaznalnrprograms.Accounting.jrInvMainAssets.Interfaces;

import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsAccModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsInvModel;
import org.kaznalnrprograms.Accounting.jrInvMainAssets.Models.jrInvMainAssetsKterModel;

import java.util.List;

public interface IjrInvMainAssetsDao {
    List<jrInvMainAssetsKterModel> getKters() throws Exception;
    List<jrInvMainAssetsAccModel> getAccs(int accs) throws Exception;
    jrInvMainAssetsInvModel getInv(int id) throws Exception;
}

