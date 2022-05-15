package org.kaznalnrprograms.Accounting.Jasper.Models;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class RepBean {
    String name;   // Имя парамтра
    String type;   // Тип параметра: int, date("dd.MM.yyyy"), double, string, array
    Object value;  // Значение параметра - получить getVal(любое значение типа, который необходимо получить)

    public String getName()                         {       return name;    }
    public void setName(String name)                {        this.name = name;    }
    public String getType()                         {        return type;    }
    public void setType(String type)                {        this.type = type;    }
    public void setValue(String value)              {        this.value = value;    }
    public String getValue()                        {        return (String)value;    }

    public int getVal(int v)                         {return Integer.parseInt ((String)this.value); }
    public String getVal(String v)                   {return (String)this.value;    }
    public double getVal(double v)                   {return Double.parseDouble((String)this.value); }
    public Date getVal(Date v) throws ParseException {return new SimpleDateFormat("dd.MM.yyyy").parse((String)this.value); }
    public RepBean[] getVal(RepBean[] v)             {return ((RepBean[])this.value); }
}
