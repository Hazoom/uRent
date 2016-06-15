package entities;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.*;

/**
 * Created with IntelliJ IDEA.
 * User: OWNER
 * Date: 31/10/14
 * Time: 13:14
 * To change this template use File | Settings | File Templates.
 */
@Table(name = "ContactUs", schema = "app")
@Entity
public class ContactUsEntity {
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

    private String email;

    @Column(name = "Email", nullable = false, length = 50)
    @Basic
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String firstName;

    @Column(name = "FirstName", nullable = true, length = 50)
    @Basic
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    private String lastName;

    @Column(name = "LastName", nullable = true, length = 50)
    @Basic
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    private String comment;

    @Column(name = "Comment", nullable = false, length = 500)
    @Basic
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    private Timestamp dateAdded;

    @Column(name = "DateAdded", nullable = false, length = 23, precision = 3)
    @Basic
    public Timestamp getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Timestamp dateAdded) {
        this.dateAdded = dateAdded;
    }

    @PrePersist
    private void prePersist(){
        this.dateAdded = new Timestamp(new Date().getTime());
    }
    
    public ContactUsEntity() {}

	public ContactUsEntity(String email, String firstName, String lastName, String comment) {
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.comment = comment;
	}
}
