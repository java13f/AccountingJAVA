package org.kaznalnrprograms.Accounting.jrOSX.Intefaces;

import org.kaznalnrprograms.Accounting.jrOSX.Models.jrOS10Models;
import java.util.List;

public interface IjrOS10DirectoryDao {

    List<jrOS10Models> ListAccs() throws Exception;

    String GetKter(int Id) throws Exception;


}
