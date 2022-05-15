package org.kaznalnrprograms.Accounting.LockTable.Models;

public class LockDateModel {
    private String min;
    private String hour;
    private String seconds;

    public String getSeconds() {
        return seconds;
    }

    public void setSeconds(String seconds) {
        this.seconds = seconds;
    }


    public String getMin() {
        return min;
    }

    public void setMin(String min) {
        this.min = min;
    }

    public String getHour() {
        return hour;
    }

    public void setHour(String hour) {
        this.hour = hour;
    }
}
