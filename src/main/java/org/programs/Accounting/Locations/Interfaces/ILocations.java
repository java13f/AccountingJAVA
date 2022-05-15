package org.kaznalnrprograms.Accounting.Locations.Interfaces;

import org.kaznalnrprograms.Accounting.Locations.Models.DepModel;
import org.kaznalnrprograms.Accounting.Locations.Models.KterModel;
import org.kaznalnrprograms.Accounting.Locations.Models.LocationsModel;
import org.kaznalnrprograms.Accounting.Locations.Models.LocationsViewModel;

import java.util.List;

public interface ILocations
{
    List<LocationsViewModel> getList(String name, int depid, int kterid, boolean del) throws Exception;

    String getKter(int KterId) throws Exception;
    KterModel getKterObj(int KterId) throws Exception;
    DepModel getDep(int depId) throws Exception;

    int save(LocationsModel model) throws Exception;

    LocationsModel getLocation(int id) throws Exception;

    void delete(int id) throws Exception;
}
