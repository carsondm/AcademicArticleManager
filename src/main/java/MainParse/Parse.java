package MainParse;

import Parse.GrobidParser;
import Category.Category;
import JsonFormat.PDFTOJSON;
import Parse.ArticleIntroParser;

import com.google.common.base.CharMatcher;
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

    static String path1 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Economic, Gov, Education\\07961326.pdf";
    static String path2 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\6385-matching-networks-for-one-shot-learning.pdf";
    static String path3 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Jayaraman_Learning_Image_Representations_ICCV_2015_paper.pdf";
    static String path4 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\about_metadata.pdf";
    static String path5 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\UCFDatabase\\06740844.pdf";
    static String path6 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Economic, Gov, Education\\07961326.pdf";
    static String path7 = "C:\\Programming\\IdeaProjects\\GroupProject\\AcademicArticleManager-Fork\\src\\main\\resources\\TestFiles(PDF)\\Health\\s41598-017-05778-z.pdf";

    public static void main(String[] args) {
        Parse parse = new Parse(path6);
        System.out.println(parse.getJsonString());

    }

    private String stringXML;

    private String title;
    private String articleAbstract;
    //private String doi;
    private ArrayList<String> authors;
    private ArrayList<String> tags;
    private String publisher;
    private String dateOfPublication;

    //private String category;
    //private String subCategory;

    private ArrayList<String> categories;
    private ArrayList<String> subCategories;

    private String jsonString;

    public Parse(String pdfFilepath){
        GrobidParser grobidParser = new GrobidParser();
        Category categorizer = null;
        PDFTOJSON pdftojson = null;
        ArticleIntroParser articleIntroParser = new ArticleIntroParser(pdfFilepath);

        String body = null;

        stringXML = grobidParser.grobidParse(pdfFilepath);
        parseXML();

        body = articleIntroParser.getArticleIntro();
        //System.out.println(body);
        categorizer = new Category(body, articleAbstract);

        categories = categorizer.getCategories();
        subCategories = categorizer.getSubCategories();

        pdftojson = new PDFTOJSON(title, articleAbstract, publisher, authors, tags, categories, subCategories, dateOfPublication);
        jsonString = pdftojson.getJsonString();
        /*
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
        */


    }

    public Parse(){
        GrobidParser grobidParser = new GrobidParser();
        Category categorizer = null;
        PDFTOJSON pdftojson = null;
        ArticleIntroParser articleIntroParser = new ArticleIntroParser(path6);

        String body = null;

        stringXML = grobidParser.grobidParse(path6);
        parseXML();

        body = articleIntroParser.getArticleIntro();

        pdftojson = new PDFTOJSON(title, articleAbstract, publisher, authors, tags, categories, subCategories, dateOfPublication);
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
            tags = new ArrayList<>();
            NodeList keywords = xmlDoc.getElementsByTagName(keywordsTag);
            String keyword;

            for (int i = 0; i < keywords.getLength(); i++){
                keyword = keywords.item(i).getTextContent();
                tags.add(keyword);
            }
        }catch (NullPointerException e){
            e.printStackTrace();
        }

    }

    /*
   * Gets the string at author tag
   * */
    private void getAuthorsXML(Document xmlDoc, String firstNameTag, String lastNameTag){

        try {
            authors = new ArrayList<>();
            //NodeList authorFirst = xmlDoc.getElementsByTagName(firstNameTag);
            //NodeList authorLast = xmlDoc.getElementsByTagName(lastNameTag);
            String fullName = null;
            NodeList authorsNode = xmlDoc.getElementsByTagName("persName");

            for (int i = 0; i < authorsNode.getLength(); i++){
                fullName = authorsNode.item(i).getTextContent();
                fullName = fixName(fullName);
                authors.add(fullName);
            }
        }catch (NullPointerException e){
            e.printStackTrace();
        }
    }

    private String fixName(String name){
        String result = name.replaceAll("\\s+"," ");
        result = result.substring(1, result.length()-1);
        return result;
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
/*
    public String getCategory() {
        return category;
    }

    public String getSubCategory() {
        return subCategory;
    }
*/
    public String getDateOfPublication() {
        return dateOfPublication;
    }

    public String getJsonString() {
        return jsonString;
    }
}
