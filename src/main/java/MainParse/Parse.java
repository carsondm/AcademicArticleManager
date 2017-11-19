package MainParse;

import Parse.GrobidParser;
import Category.Category;
import JsonFormat.PDFTOJSON;

import org.xml.sax.*;
import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;

/*
* Integrates GrobidParser, Category, PDFTOJSON
* */
public class Parse {

    static String path1 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Ahmed_An_Improved_Deep_2015_CVPR_paper.pdf";
    static String path2 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\6385-matching-networks-for-one-shot-learning.pdf";
    static String path3 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Jayaraman_Learning_Image_Representations_ICCV_2015_paper.pdf";
    static String path4 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\about_metadata.pdf";
    static String path5 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\UCFDatabase\\06740844.pdf";

    private String stringXML;

    private String title;
    private String articleAbstract;
    //private String doi;
    private ArrayList<String> authors = new ArrayList<>();
    private ArrayList<String> tags = new ArrayList<>();
    private String publisher;
    private String category;
    private String subCategory;
    private String dateOfPublication;

    private String jsonString;

    public static void main(String[] args) {
        Parse parse = new Parse(path2);
        System.out.println(parse.getJsonString());

    }

    public Parse(String pdfFilepath){
        GrobidParser grobidParser = new GrobidParser();
        Category categorizer = null;
        PDFTOJSON pdftojson = null;

        stringXML = grobidParser.grobidParse(pdfFilepath);
        parseXML();

        categorizer = new Category(title, articleAbstract);
        try {
            category = categorizer.getCategory();
        }catch (NullPointerException e){
            e.printStackTrace();
            category = null;
        }
        try {
            subCategory = categorizer.getSubCategory();
        }catch (NullPointerException e){
            e.printStackTrace();
            subCategory = null;
        }

        pdftojson = new PDFTOJSON(title, articleAbstract, publisher, authors, tags, category, subCategory, dateOfPublication);
        jsonString = pdftojson.getJsonString();

    }

    /*Parses String xml
    and populates
         private String title;
    private String articleAbstract;
    //private String doi;
    private ArrayList<String> authors = new ArrayList<>();
    private ArrayList<String> tags = new ArrayList<>();
    private String publisher;
    private String dateOfPublication*/
    private void parseXML(){
        DocumentBuilder db = null;
        try {
            db = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            InputSource is = new InputSource();
            is.setCharacterStream(new StringReader(stringXML));
            Document xmlDoc = db.parse(is);

            getAuthorsXML(xmlDoc, "forename", "surname");
            getTitleXML(xmlDoc, "title");
            getTagsXML(xmlDoc, "term");
            getPublicationInformationXML(xmlDoc, "publicationStmt", "date", "publisher");
            getAbstractXML(xmlDoc, "abstract");
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    /*
    * Gets the string at title tag
    * */
    private void getTitleXML(Document xmlDoc, String titleTag){
        NodeList titleNode = xmlDoc.getElementsByTagName(titleTag);
        title = titleNode.item(0).getTextContent();
    }

    /*
   * Gets the string at abstract tag
   * */
    private void getAbstractXML(Document xmlDoc, String abstractTag){
        Node abstractNode = xmlDoc.getElementsByTagName("abstract").item(0);
        articleAbstract = abstractNode.getTextContent();
        articleAbstract = articleAbstract.replaceAll("  ", "");
        articleAbstract = articleAbstract.replaceAll("\n", "");
    }

    /*
   * Gets the string at publisher tag
   * */
    private void getPublicationInformationXML(Document xmlDoc, String publicationTag, String dateTag, String publisherTag){
        Node dateNode = xmlDoc.getElementsByTagName(dateTag).item(0);
        Node publisherNode = xmlDoc.getElementsByTagName(publisherTag).item(0);
        dateOfPublication = dateNode.getTextContent();
        publisher = publisherNode.getTextContent();
    }

    /*
   * Gets the string at keywords tag
   * */
    private void getTagsXML(Document xmlDoc, String keywordsTag){
        try {
            NodeList keywords = xmlDoc.getElementsByTagName(keywordsTag);
            String keyword;

            for (int i = 0; i < keywords.getLength(); i++){
                keyword = keywords.item(i).getTextContent();
                tags.add(keyword);
            }
        }catch (NullPointerException e){
            authors = null;
            e.printStackTrace();
        }

    }

    /*
   * Gets the string at author tag
   * */
    private void getAuthorsXML(Document xmlDoc, String firstNameTag, String lastNameTag){

        try {
            NodeList authorFirst = xmlDoc.getElementsByTagName(firstNameTag);
            NodeList authorLast = xmlDoc.getElementsByTagName(lastNameTag);
            String fullName;

            for (int i = 0; i < authorFirst.getLength(); i++){
                fullName = authorFirst.item(i).getTextContent() + " " + authorLast.item(i).getTextContent();
                authors.add(fullName);
            }
        }catch (NullPointerException e){
            authors = null;
            e.printStackTrace();
        }


    }

    public String getTitle() {
        return title;
    }

    public String getArticleAbstract() {
        return articleAbstract;
    }

    public ArrayList<String> getAuthors() {
        return authors;
    }

    public ArrayList<String> getTags() {
        return tags;
    }

    public String getPublisher() {
        return publisher;
    }

    public String getCategory() {
        return category;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public String getDateOfPublication() {
        return dateOfPublication;
    }

    public String getJsonString() {
        return jsonString;
    }
}
