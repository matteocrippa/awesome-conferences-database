require('cgi')

README = 'README.md'
CONTENTS = 'contents.json'

def get_json()
    require 'json'
    JSON.parse(File.read CONTENTS)
end

def output_content_category(c, indent)
  toc = "\n"

  for i in 1..indent
    toc << '#'
  end

  toc << " #{c}\n"
  toc << "[back to top](#readme) \n" if indent>2
  toc << "\n"

  toc
end

def gmapUrl(where)
  url = "https://www.google.it/maps/" + CGI.escape(where)
  url
end

def output_conferences(conferences, year)
  o = ''
  conferences.select { |p| p['year'] == year }
    .sort_by {|k,v| k['startdate']}
    .sort_by {|k,v| k['title'].downcase }
    .each do |p|
      where = gmapUrl(p['where'])
      o << "* [#{p['title']}](#{p['homepage']}) #{p['startdate']} - #{p['enddate']} @ [#{p['country']}](#{where})\n"
    end
    o
end

def output_content(j)
  toc = ''

  conferences = j['conferences']

  j['years'].each do |c|
    toc << output_content_category(c, 2)
    toc << output_conferences(conferences, c)
  end
  toc
end

def output_header(j)
  header       = j['header']
  contributing = j['header_contributing']
  app          = j['ios_app_link']
  num_projects = j['conferences'].count

  o = header
  o << "\n\n"
  o << output_table(app, num_projects)
  o << "\n\n### Contributing\n\n"
  o << contributing

  o
end

def output_table(ios_app_link, num_projects)
  require 'date'

  date = DateTime.now
  date_display = date.strftime "%B %d, %Y"

  o = "| iOS App | Awesome | Conferences | Updated\n| :-: | :-: | :-: | :-: | :-:\n"
  o << "| [![Download on the App Store](https://img.shields.io/badge/download-app%20store-ff69b4.svg)](#{ios_app_link}) | "
  o << '[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome) | '
  o << "![](https://img.shields.io/badge/conferences-#{num_projects}-orange.svg) | "
  o << date_display

  o
end

def output_toc(j)
  toc = "\n\n### Years\n\n"

  j['years'].each do |c|
    id = c
    toc << "- [#{id}](##{id})\n"
  end

  toc
end

def write_readme(j, filename)
    # output = description(j)
    output = output_header(j)
    output << output_toc(j)
    output << output_content(j)

    File.open(filename, 'w') { |f| f.write output}
    puts "Wrote #{filename} :-)"
end

j = get_json()
write_readme(j, README)
