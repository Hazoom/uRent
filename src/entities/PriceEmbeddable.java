package entities;

import javax.persistence.*;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 31/10/14
 * Time: 13:14
 * To change this template use File | Settings | File Templates.
 */
@Embeddable
public class PriceEmbeddable {

    private Float day;

    @Column(name = "DailyPrice", length = 24)
    public Float getDay() {
        return day;
    }

    public void setDay(Float day) {
        this.day = day;
    }

    private Float week;

    @Column(name = "WeeklyPrice", length = 24)
    public Float getWeek() {
        return week;
    }

    public void setWeek(Float week) {
        this.week = week;
    }

    private Float month;

    @Column(name = "MonthlyPrice", length = 24)
    public Float getMonth() {
        return month;
    }

    public void setMonth(Float month) {
        this.month = month;
    }

    private Float value;

    @Column(name = "Value", length = 24)
    public Float getValue() {
        return value;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    public PriceEmbeddable() {
    }

    public PriceEmbeddable(Float day, Float week, Float month, Float value) {
        this.day = day;
        this.week = week;
        this.month = month;
        this.value = value;
    }
}
