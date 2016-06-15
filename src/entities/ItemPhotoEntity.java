package entities;

import org.hibernate.annotations.*;
import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 01/11/14
 * Time: 13:11
 * To change this template use File | Settings | File Templates.
 */
@Table(name = "ItemPhoto", schema = "app")
@Entity
@NamedQueries({
        @NamedQuery(name= "ItemPhoto.ID", query="SELECT ip FROM ItemPhotoEntity AS ip",
                hints={@QueryHint(name="org.hibernate.cacheable", value="true")})
})
@FilterDefs({
        @FilterDef(name="item", parameters={
                @ParamDef( name="itemId", type="java.lang.Integer")
        })
})
@Filters( {
        @Filter(name="item", condition="ITEMID = :itemId")
} )
//@Cacheable
//@Cache(usage=CacheConcurrencyStrategy.NONSTRICT_READ_WRITE, region="itemPhoto")
public class ItemPhotoEntity {
    private int id;

    @Column(name = "Id", nullable = false, length = 10)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private int itemId;

    @Column(name = "ITEMID", length = 10)
    @Basic
    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    private String photo;

    @Column(name = "PHOTO", nullable = false, length = 2147483647)
    @Basic
    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public ItemPhotoEntity() {
    }

    public ItemPhotoEntity(String photo) {
        this.photo = photo;
    }

    public ItemPhotoEntity(int itemId, String photo) {
        this.itemId = itemId;
        this.photo = photo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ItemPhotoEntity that = (ItemPhotoEntity) o;

        if (id != that.id) return false;
        if (itemId != that.itemId) return false;
        if (photo != null ? !photo.equals(that.photo) : that.photo != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + itemId;
        result = 31 * result + (photo != null ? photo.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "ItemPhotoEntity{" +
                "id=" + id +
                ", itemId=" + itemId +
                ", photo='" + photo + '\'' +
                '}';
    }
}