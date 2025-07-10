package pe.edu.vallegrande.hackaton;

public class InstitucionDto {
    private String id;
    private String dni;
    private String firstName;
    private String lastName;
    private String date;

    public InstitucionDto(String id, String dni, String firstName, String lastName, String date) {
        this.id = id;
        this.dni = dni;
        this.firstName = firstName;
        this.lastName = lastName;
        this.date = date;

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setdni(String dni) {
        this.dni = dni;
    }

    public String getdni() {
        return dni;
    }

    public void setfirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getfirstName() {
        return firstName;
    }

    public String getlasttName() {
        return lastName;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getdate() {
        return date;
    }
}