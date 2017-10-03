require('cgi')
require('countries')

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
  url = "https://www.google.com/maps/search/?api=1&query=" + CGI.escape(where)
  url
end

def sort_by_date(dates, direction="ASC")
  sorted = dates.sort
  sorted.reverse! if direction == "DESC"
  sorted
end

def output_conferences(conferences, year)
  o = ""
  o << "| Name | Date | Place | Call For Paper |\n"
  o << "| --- | --- | --- | --- |\n"
    conferences.select { |p| p['year'] == year }
    .sort_by {|k,v| Date.strptime(k['startdate'], '%Y/%m/%d')}
    .each do |p|
      # render only upcoming events
      date = Date.parse p['startdate']
      if date > Date.today
        where = gmapUrl(p['where'])
        startDate = p['startdate'].gsub! "#{p['year']}/", ''
        endDate = p['enddate'].gsub! "#{p['year']}/", ''
        o << "| [#{p['title']}](#{p['homepage']}) | #{startDate}"
        if startDate != endDate
          o << " - #{endDate}"
        end
        o << "|"
        c = ISO3166::Country.find_country_by_name(p['country'])
        if !c.nil?
          o << "#{c.emoji_flag} "
        end
        o << "[#{p['country']}](#{where})"
        o << "|"
        if p['callforpaper'] == true
          o << " (( 📢 "
        else
          o << " --- "
        end
        o << "|\n"
      end
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
  o << output_table(num_projects)
  o << "\n\n### Mobile Apps\n\n"
  o << "[![Download on the Play Store](https://raw.githubusercontent.com/matteocrippa/awesome-mobile-conferences-android/master/.github/google-play-badge.png)](#{j['android_app_link']})"
  o << "[![Download on the App Store](https://github.com/AwesomeMobileConferences/awesome-mobile-conferences/blob/master/.github/appstore.png?raw=true)](#{j['ios_app_link']})"
  o << "\n\n### Contributing\n\n"
  o << contributing
  o << "\n\n\n### Legenda\n\n"
  o << "- (( 📢  > Call for Paper open"

  o
end

def output_table(num_projects)
  require 'date'

  date = DateTime.now
  date_display = date.strftime "%B %d, %Y"

  o = "| Awesome | Conferences | Updated\n"
  o << "| :-: | :-: | :-: \n"
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
    #output << output_toc(j)
    output << output_content(j)

    File.open(filename, 'w') { |f| f.write output}
    puts "Wrote #{filename} :-)"
end

j = get_json()
write_readme(j, README)
