package org.kaznalnrprograms.Accounting.Jasper.Models;

public class RepParams {
    private String jrxml;
    private String postFix;

    private RepBean[] params;
    public String getJrxml()                {        return jrxml;    }
    public String getPostFix()              {        return postFix;    }
    public void setPostFix(String postFix)  {        this.postFix = postFix;    }
    public void setJrxml(String jrxml)      {        this.jrxml = jrxml;   }
    public RepBean[] getParams()            {        return params;    }
    public void setParams(RepBean[] params) {        this.params = params;    }
}

