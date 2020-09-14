#       Copyright 2018 IBM Corp All Rights Reserved

#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at

#       http://www.apache.org/licenses/LICENSE-2.0

#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

FROM centos:latest

# Enable extra packages
RUN yum -y install epel-release

# Download Node JS 8
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -

# Install build tools
RUN yum -y install gcc-c++ make nodejs

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install --no-optional

RUN chown -R 1001:0  /usr/src/app
USER 1001

ENV HOST 0.0.0.0
EXPOSE 8000

# start command
CMD [ "node", "./bin/www" ]
